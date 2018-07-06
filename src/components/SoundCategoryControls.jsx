import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Slider } from 'material-ui-slider';

import SoundCategoryLoopButton from './SoundCategoryLoopButton';
import SoundCategoryStopButton from './SoundCategoryStopButton';

export default class SoundCategoryControls extends Component {
  constructor() {
    super();
    this.handleLoopToggle = this.handleLoopToggle.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  }

  handleLoopToggle() {
    const { uuid, onLoopToggle } = this.props;
    onLoopToggle(uuid);
  }

  handleStop() {
    const { uuid, onStop } = this.props;
    onStop(uuid);
  }

  handleVolumeChange(value) {
    const { uuid, onVolumeChange } = this.props;
    onVolumeChange(uuid, value);
  }

  render() {
    const {
      loop,
      playing,
      volume,
    } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <Slider
          max={100}
          min={0}
          onChange={this.handleVolumeChange}
          value={volume}
        />
        <div>
          <SoundCategoryStopButton playing={playing} onClick={this.handleStop} />
          <SoundCategoryLoopButton loop={loop} onClick={this.handleLoopToggle} />
        </div>
      </div>
    );
  }
}

SoundCategoryControls.propTypes = {
  loop: PropTypes.bool,
  onLoopToggle: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  playing: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
  volume: PropTypes.number.isRequired,
};

SoundCategoryControls.defaultProps = {
  loop: false,
  playing: false,
};
