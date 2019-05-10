import React, { Component } from 'react';
import RecorderJS from 'recorder-js';

import { getAudioStream, exportBuffer } from '../utilities/audio';

import axios from 'axios';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: null,
      recording: false,
      recorder: null
    };
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
  }

  async componentDidMount() {
    let stream;

    try {
      stream = await getAudioStream();
    } catch (error) {
      // Users browser doesn't support audio.
      // Add your handler here.
      console.log(error);
    }

    this.setState({ stream });
  }

  startRecord() {
    const { stream } = this.state;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorder = new RecorderJS(audioContext);
    recorder.init(stream);

    this.setState(
      {
        recorder,
        recording: true
      },
      () => {
        recorder.start();
      }
    );
  }

  async stopRecord() {
    const { recorder } = this.state;

    const { buffer } = await recorder.stop()
    const audio = exportBuffer(buffer[0]);

    // Process the audio here.
    console.log(audio);

    const fileName = 'voicequery.wav';
    const options = {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    };
    axios.put(`https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/upload2/${fileName}`, audio, options)
    .then((response) => {
      console.log(response);
      this.setState({status: 'uploaded successfully'});
    })
    .catch(function (error) {
        console.log(error);
    });

    this.setState({
      recording: false
    });
  }

  render() {
    const { recording, stream } = this.state;

    // Don't show record button if their browser doesn't support it.
    if (!stream) {
      return null;
    }

    return (
      <button
        onClick={() => {
          recording ? this.stopRecord() : this.startRecord();
        }}
        >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    );
  }
}

export default Recorder;