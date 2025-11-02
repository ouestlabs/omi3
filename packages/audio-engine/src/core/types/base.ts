/**
 * Base metadata
 */
export type BaseMetadata = Record<string, unknown>;

/**
 * @abstract Base class for Track tracks.
 * Extends this class to create a custom track type.
 */
export abstract class Track<TMetadata extends BaseMetadata = BaseMetadata> {
  /** URL of the audio file */
  abstract url: string;
  /** Optional unique identifier for the track */
  abstract id?: string | number;
  /** Extensible metadata object */
  metadata?: TMetadata;
  /** Duration of the track in seconds (if known) */
  duration?: number;
  /** Audio codec (e.g., 'mp3', 'opus') */
  codec?: string;
  /** Bitrate in kbps (if known) */
  bitrate?: number;
  /** Sample rate in Hz (if known) */
  sampleRate?: number;
  /** Whether the audio is lossless */
  lossless?: boolean;
  /** Track title */
  title?: string;
  /** Track artist */
  artist?: string;
  /** Album title */
  album?: string;
  /** Artist associated with the album */
  albumArtist?: string;
  /** Composer */
  composer?: string;
  /** Genre */
  genre?: string;
  /** Year of release */
  year?: number | string;
  /** Track number within the album/disc */
  trackNumber?: number | string;
  /** Disc number if part of a multi-disc album */
  discNumber?: number | string;
  /** Comment embedded in the track */
  comment?: string;
  /** Lyrics */
  lyrics?: string;
  /** Software or hardware used to encode the file */
  encodedBy?: string;
  /** Artwork associated with the track (used for Media Session API) */
  artwork?: MediaImage;
  /** Beats per minute */
  bpm?: number;
  /** iTunes grouping metadata */
  grouping?: string;
  /** Musical key of the track */
  initialKey?: string;
  /** International Standard Recording Code */
  isrc?: string;
  /** Publisher */
  publisher?: string;
  /** Copyright information */
  copyright?: string;
}
