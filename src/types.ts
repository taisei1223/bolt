export interface VideoType {
  id: string;
  blob: string; // Base64 encoded video data
  thumbnail: string; // Base64 encoded thumbnail
  duration: number;
  createdAt: number;
}