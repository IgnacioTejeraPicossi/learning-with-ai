"""
Voice Cloning Backend using Coqui TTS
Handles voice recording, training, and synthesis
"""

import os
import json
import uuid
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any
import logging
from datetime import datetime

# Voice cloning imports
try:
    from TTS.api import TTS
    from TTS.utils.manage import ModelManager
    import torch
    import numpy as np
    import soundfile as sf
    TTS_AVAILABLE = True
except ImportError:
    TTS_AVAILABLE = False
    print("Warning: Coqui TTS not installed. Install with: pip install coqui-tts")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VoiceCloningManager:
    """Manages voice cloning operations using Coqui TTS"""
    
    def __init__(self, models_dir: str = "voice_models", audio_dir: str = "voice_audio"):
        self.models_dir = Path(models_dir)
        self.audio_dir = Path(audio_dir)
        self.models_dir.mkdir(exist_ok=True)
        self.audio_dir.mkdir(exist_ok=True)
        
        # Initialize TTS model
        self.tts = None
        self.model_loaded = False
        self._load_tts_model()
        
        # Training status tracking
        self.training_status = {}
    
    def _load_tts_model(self):
        """Load the TTS model for voice cloning"""
        if not TTS_AVAILABLE:
            logger.error("Coqui TTS not available")
            return False
            
        try:
            # Use YourTTS model for voice cloning
            self.tts = TTS(
                model_name="tts_models/multilingual/multi-dataset/your_tts",
                progress_bar=False,
                gpu=torch.cuda.is_available()
            )
            self.model_loaded = True
            logger.info("TTS model loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to load TTS model: {e}")
            return False
    
    async def save_voice_sample(self, user_id: str, audio_data: bytes, filename: str) -> Dict[str, Any]:
        """Save uploaded voice sample"""
        try:
            # Create user directory
            user_dir = self.audio_dir / user_id
            user_dir.mkdir(exist_ok=True)
            
            # Save audio file
            audio_path = user_dir / filename
            with open(audio_path, 'wb') as f:
                f.write(audio_data)
            
            # Validate audio file
            if not self._validate_audio_file(audio_path):
                return {
                    "success": False,
                    "error": "Invalid audio file format"
                }
            
            return {
                "success": True,
                "audio_path": str(audio_path),
                "user_id": user_id,
                "filename": filename
            }
            
        except Exception as e:
            logger.error(f"Error saving voice sample: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _validate_audio_file(self, audio_path: Path) -> bool:
        """Validate audio file format and quality"""
        try:
            # Check if file exists and has content
            if not audio_path.exists() or audio_path.stat().st_size == 0:
                return False
            
            # Try to read audio file
            data, sample_rate = sf.read(str(audio_path))
            
            # Check duration (should be 30-60 seconds)
            duration = len(data) / sample_rate
            if duration < 10 or duration > 120:
                logger.warning(f"Audio duration {duration}s is outside recommended range (10-120s)")
            
            # Check sample rate
            if sample_rate < 16000:
                logger.warning(f"Sample rate {sample_rate}Hz is below recommended 16kHz")
            
            return True
            
        except Exception as e:
            logger.error(f"Audio validation failed: {e}")
            return False
    
    async def train_voice_model(self, user_id: str, audio_path: str) -> Dict[str, Any]:
        """Train voice model for user"""
        training_id = str(uuid.uuid4())
        
        try:
            # Update training status
            self.training_status[training_id] = {
                "status": "training",
                "progress": 0,
                "user_id": user_id,
                "started_at": datetime.now().isoformat(),
                "error": None
            }
            
            # Simulate training process (in real implementation, this would train the model)
            await self._simulate_training(training_id)
            
            # Create voice model metadata
            voice_model = {
                "user_id": user_id,
                "training_id": training_id,
                "audio_path": audio_path,
                "model_path": f"voice_models/{user_id}/voice_model.pt",
                "created_at": datetime.now().isoformat(),
                "status": "completed"
            }
            
            # Save voice model metadata
            await self._save_voice_model_metadata(user_id, voice_model)
            
            # Update training status
            self.training_status[training_id]["status"] = "completed"
            self.training_status[training_id]["progress"] = 100
            
            return {
                "success": True,
                "training_id": training_id,
                "voice_model": voice_model
            }
            
        except Exception as e:
            logger.error(f"Voice training failed: {e}")
            self.training_status[training_id]["status"] = "failed"
            self.training_status[training_id]["error"] = str(e)
            
            return {
                "success": False,
                "error": str(e),
                "training_id": training_id
            }
    
    async def _simulate_training(self, training_id: str):
        """Simulate training process with progress updates"""
        for progress in range(0, 101, 10):
            self.training_status[training_id]["progress"] = progress
            await asyncio.sleep(1)  # Simulate processing time
    
    async def _save_voice_model_metadata(self, user_id: str, voice_model: Dict[str, Any]):
        """Save voice model metadata"""
        user_models_dir = self.models_dir / user_id
        user_models_dir.mkdir(exist_ok=True)
        
        metadata_path = user_models_dir / "voice_model.json"
        with open(metadata_path, 'w') as f:
            json.dump(voice_model, f, indent=2)
    
    async def synthesize_speech(self, user_id: str, text: str, language: str = "en") -> Dict[str, Any]:
        """Synthesize speech using user's trained voice"""
        try:
            # Check if user has trained voice
            voice_model_path = self.models_dir / user_id / "voice_model.json"
            if not voice_model_path.exists():
                return {
                    "success": False,
                    "error": "No trained voice model found"
                }
            
            # Load voice model metadata
            with open(voice_model_path, 'r') as f:
                voice_model = json.load(f)
            
            # Get audio path
            audio_path = voice_model.get("audio_path")
            if not audio_path or not Path(audio_path).exists():
                return {
                    "success": False,
                    "error": "Voice sample not found"
                }
            
            # Generate output path
            output_dir = self.audio_dir / user_id / "generated"
            output_dir.mkdir(exist_ok=True)
            output_filename = f"synthesized_{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav"
            output_path = output_dir / output_filename
            
            # Synthesize speech using TTS
            if self.model_loaded and self.tts:
                self.tts.tts_to_file(
                    text=text,
                    speaker_wav=audio_path,
                    file_path=str(output_path),
                    language=language
                )
                
                return {
                    "success": True,
                    "audio_path": str(output_path),
                    "filename": output_filename,
                    "text": text,
                    "language": language
                }
            else:
                return {
                    "success": False,
                    "error": "TTS model not available"
                }
                
        except Exception as e:
            logger.error(f"Speech synthesis failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_training_status(self, training_id: str) -> Dict[str, Any]:
        """Get training status"""
        return self.training_status.get(training_id, {
            "status": "not_found",
            "error": "Training ID not found"
        })
    
    async def get_user_voice_models(self, user_id: str) -> Dict[str, Any]:
        """Get all voice models for a user"""
        try:
            user_models_dir = self.models_dir / user_id
            if not user_models_dir.exists():
                return {
                    "success": True,
                    "voice_models": []
                }
            
            voice_models = []
            metadata_path = user_models_dir / "voice_model.json"
            
            if metadata_path.exists():
                with open(metadata_path, 'r') as f:
                    voice_model = json.load(f)
                    voice_models.append(voice_model)
            
            return {
                "success": True,
                "voice_models": voice_models
            }
            
        except Exception as e:
            logger.error(f"Error getting user voice models: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def delete_voice_model(self, user_id: str) -> Dict[str, Any]:
        """Delete user's voice model"""
        try:
            user_models_dir = self.models_dir / user_id
            user_audio_dir = self.audio_dir / user_id
            
            # Remove model files
            if user_models_dir.exists():
                import shutil
                shutil.rmtree(user_models_dir)
            
            # Remove audio files
            if user_audio_dir.exists():
                import shutil
                shutil.rmtree(user_audio_dir)
            
            return {
                "success": True,
                "message": "Voice model deleted successfully"
            }
            
        except Exception as e:
            logger.error(f"Error deleting voice model: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Global instance
voice_cloning_manager = VoiceCloningManager() 