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
import beatsE01_4 from '../reels/E01-4.beats.json';
import {ReelE01_4, Reel4Props} from './reels/ReelE01_4';
import beatsE01_5 from '../reels/E01-5.beats.json';
import {ReelE01_5, Reel5Props} from './reels/ReelE01_5';
import beatsE01_6 from '../reels/E01-6.beats.json';
import {ReelE01_6, Reel6Props} from './reels/ReelE01_6';
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
    <Composition
      id="Reel-E01-4"
      component={ReelE01_4}
      durationInFrames={30 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{...SHORT_DEFAULTS, beats: beatsE01_4} as unknown as Reel4Props}
      calculateMetadata={({props}: {props: Reel4Props}) => ({
        durationInFrames: Math.round(props.durationSec * props.fps),
        fps: props.fps,
      })}
    />
    <Composition
      id="Reel-E01-5"
      component={ReelE01_5}
      durationInFrames={30 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{...SHORT_DEFAULTS, beats: beatsE01_5} as unknown as Reel5Props}
      calculateMetadata={({props}: {props: Reel5Props}) => ({
        durationInFrames: Math.round(props.durationSec * props.fps),
        fps: props.fps,
      })}
    />
    <Composition
      id="Reel-E01-6"
      component={ReelE01_6}
      durationInFrames={30 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{...SHORT_DEFAULTS, beats: beatsE01_6} as unknown as Reel6Props}
      calculateMetadata={({props}: {props: Reel6Props}) => ({
        durationInFrames: Math.round(props.durationSec * props.fps),
        fps: props.fps,
      })}
    />
    <Still id="ArticleCover" component={ArticleCover} width={2000} height={800} />
  </>
);
