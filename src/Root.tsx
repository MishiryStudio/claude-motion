import React from 'react';
import {Composition, Still} from 'remotion';
import {ArticleCover} from './ArticleCover';
import {EffortVideo} from './EffortVideo';
import {FPS, H, TL, W} from './lib';
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
    <Still id="ArticleCover" component={ArticleCover} width={2000} height={800} />
  </>
);
