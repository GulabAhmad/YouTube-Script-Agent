export interface VideoScriptCreate {
  topic: string;
  script: string;
  user_id: number;
  youtube_url: string;
  research: string;
  youtube_transcript: string;
  outline: string;
}

export interface VideoScript extends VideoScriptCreate {
  id: number;
}

// Legacy interface name for backward compatibility
export interface TopicData extends VideoScript {} 