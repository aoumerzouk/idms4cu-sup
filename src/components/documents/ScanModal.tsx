import React, { useState, useRef } from 'react';
import { Scan, AlertCircle, Camera, FileText } from 'lucide-react';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';
import Modal from '../modals/Modal';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntity: MemberIdentifier | AccountIdentifier;
  onScan: (imageData: Blob, metadata: {
    title: string;
    tags: string[];
  }) => Promise<void>;
}

export default function ScanModal({
  isOpen,
  onClose,
  selectedEntity,
  onScan
}: ScanModalProps) {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        setError(null);
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
      console.error('Error accessing camera:', err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      // Stop the camera stream
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCapturing(false);
      
      // Convert canvas to image
      canvas.toBlob((blob) => {
        if (blob) {
          setScannedImage(URL.createObjectURL(blob));
          if (!title) {
            setTitle(`Scanned Document - ${new Date().toLocaleString()}`);
          }
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(scannedImage);
      const imageBlob = await response.blob();
      await onScan(imageBlob, {
        title: title.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save scanned document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scan Document"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          {scannedImage ? (
            <div className="space-y-2">
              <img 
                src={scannedImage} 
                alt="Scanned document" 
                className="max-h-64 mx-auto"
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setScannedImage(null);
                    startCamera();
                  }}
                  className="text-blue-500 text-sm hover:text-blue-600"
                >
                  Scan Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isCapturing ? (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-h-64 object-contain bg-black"
                  />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={captureImage}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Scan className="w-8 h-8 text-gray-400 mx-auto" />
                  <button
                    type="button"
                    onClick={startCamera}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Start Camera
                  </button>
                </div>
              )}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Document Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="scan, document"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!scannedImage || loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
