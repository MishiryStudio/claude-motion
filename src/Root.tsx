import React from 'react';
import {Composition, Still} from 'remotion';
import {ArticleCover} from './ArticleCover';
import {EffortVideo} from './EffortVideo';
import {FPS, H, TL, W} from './lib';
import {ReelE01_1, ReelProps} from './reels/ReelE01_1';
import beatsE01_1 from '../reels/E01-1.beats.json';
import beatsE01_2 from '../reels/E01-2.beats.json';
import {ReelE01_2, Reel2Props} from './reels/ReelE01_2';
import beatsE01_3 from '../reels/E01-3.beats.json';
import {ReelE01_3, Reel3Props} from './reels/ReelE01_3';
import {Short, SHORT_DEFAULTS, ShortProps} from './shorts/Short';

export const Root: React.FC = () => (
  <>
    <Composition
      id="EffortVideo"
      component={EffortVideo}
      durationInFrames={Math.round(TL.duration * FPS)}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="Short"
      component={Short}
      durationInFrames={Math.round(SHORT_DEFAULTS.durationSec * SHORT_DEFAULTS.fps)}
      fps={SHORT_DEFAULTS.fps}
      width={1080}
      height={1920}
      defaultProps={SHORT_DEFAULTS}
      calculateMetadata={({props}: {props: ShortProps}) => ({
        durationInFrames: Math.round(props.durationSec * props.fps),
        fps: props.fps,
      })}
    />
    <Composition
      id="Reel-E01-1"
      component={ReelE01_1}
      durationInFrames={30 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{...SHORT_DEFAULTS, beats: beatsE01_1} as unknown as ReelProps}
      calculateMetadata={({props}: {props: ReelProps}) => ({
        durationInFrames: Math.round(props.durationSec * props.fps),
        fps: props.fps,
      })}
    />
    <Composition
      id="Reel-E01-2"
      component={ReelE01_2}
      durationInFrames={30 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{...SHORT_DEFAULTS, beats: beatsE01_2} as unknown as Reel2Props}
      calculateMetadata={({props}: {props: Reel2Props}) => ({
        durationInFrames: Math.round(props.durationSec * props.fps),
        fps: props.fps,
      })}
    />
    <Composition
      id="Reel-E01-3"
      component={ReelE01_3}
      durationInFrames={30 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{...SHORT_DEFAULTS, beats: beatsE01_3} as unknown as Reel3Props}
      calculateMetadata={({props}: {props: Reel3Props}) => ({
        durationInFrames: Math.round(props.durationSec * props.fps),
        fps: props.fps,
      })}
    />
    <Still id="ArticleCover" component={ArticleCover} width={2000} height={800} />
  </>
);
