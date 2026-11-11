export interface BeatMetadata {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  license: string;
  sourceUrl: string;
  attributionText: string;
  dateAdded: string;
  audioUrl?: string;
  isProcedural?: boolean;
}

export type PercussionType =
  | "kick"
  | "snare"
  | "hat_closed"
  | "hat_open"
  | "sub_bass"
  | "darbouka_dum"
  | "darbouka_tek"
  | "krakeb";

export interface BeatStep {
  time: number;
  beat: number; // 1, 2, 3, 4
  bar: number;
}
