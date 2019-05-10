import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import Gallery from "react-photo-gallery";
import axios from 'axios';
import Recorder from 'react-mp3-recorder';

import ReactAudioPlayer from 'react-audio-player';

import blobToBuffer from 'blob-to-buffer';

// const API = 'https://hn.algolia.com/api/v1/search?query=';
// const DEFAULT_QUERY = 'redux';
const API2 = 'https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/search';


export default class Home extends Component {
    state = {
        inputValue: '',
        photos: [],
        url: '',
        statusMsg: ''
    };

    // let photoList = [];

    componentDidMount() {
        // fetch(API2 + "?q=show+me+cat", {
        //     method: 'get',
        //     headers: {
        //       'Accept': 'application/json',
        //       'Content-Type': 'application/json',
        //     },
        // })
        //   .then(response => response.json())
        //   .then(data => console.log(data));
      }
    

    handleInputChange = (event) => {
        this.setState({inputValue: event.target.value});
    }

    handleFormSubmit = (event) => {
        // console.log(this.state.inputValue);
        this._queryForImage(this.state.inputValue);
        event.preventDefault();
    };

    _queryForImage = (query) => {
        axios.get(API2, {
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json',
            // },
            params: {
                q: query
            }
        })
        .then((response) => {
            console.log(response);
            let urls = response.data.results.map(({ url }) => ({'src': url}));
            console.log(urls);
            this.setState({photos: urls, 
                statusMsg: 'Query successful with results below: '
            });

        })
        .catch((error) => {
            console.log(error);
            this.setState({statusMsg: `Query failed with error msg: ${error}`});
        });
    }

    _onRecordingComplete = (blob) => {
        blobToBuffer(blob, (err, buffer) => {
          if (err) {
            console.error(err)
            return
          }
    
          console.log('recording', blob)


          const options = {
            headers: {
              'Content-Type': blob.type
            }
          };
        //   console.log(blob.type);
      
          axios.put(`https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/uploadaudio/voicequery.mp3`, blob, options)
          .then((response) => {
            console.log(response);
            this.setState({status: 'your voice uploaded successfully'});

            this.getTranscript();

          })
          .catch(function (error) {
              console.log(error);
          });

    
          if (this.state.url) {
            window.URL.revokeObjectURL(this.state.url)
          }
    
          this.setState({
            url: window.URL.createObjectURL(blob)
          })
        })
      }
    
      _onRecordingError = (err) => {
        console.log('error recording', err)
    
        if (this.state.url) {
          window.URL.revokeObjectURL(this.state.url)
        }
    
        this.setState({ url: null })
      }

      getTranscript = () => {
        axios.get(`https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/gettranscript`)
        .then((response) => {
            this.setState({statusMsg: 'Querying for you... Pls be patient, AWS Transcribe is very slow..'});
            console.log(response.data);
            let repeat = setInterval(() => {
                axios.get(`https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/getresult`, {
                    params: {
                        name: response.data
                    }
                })
                .then((response) => {
                    console.log(response);
                    if (response.data.state === "COMPLETED") {
                        console.log('completed!');
                        console.log(response.data.message);
                        clearInterval(repeat);
                        this.setState({statusMsg: `Get transcript successful! Transcript is: ${response.data.message}`});
                        this._queryForImage(response.data.message);
                    } else if (response.data.state === "FAILED") {
                        console.log(response.data.message);
                        clearInterval(repeat);
                        this.setState({statusMsg: 'Get transcript failed!'});
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }, 5000);
        })
        .catch(function (error) {
            console.log(error);
        });
      }

    render() {
        const { url } = this.state;

        return (
            <div>
                <form class="form-inline md-form form-sm mt-0" onSubmit={this.handleFormSubmit} onChange={this.handleInputChange}>
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <input class="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" />
                </form>
                <div
                    style={{
                        marginLeft:10
                    }}
                >
                    <div>
                        <Recorder
                        onRecordingComplete={this._onRecordingComplete}
                        onRecordingError={this._onRecordingError}
                        style={{
                            margin: '0 auto'
                        }}
                    />
                    <p>Click and hold to start recording</p>
                        {url && (
                        <div>
                            <ReactAudioPlayer
                            src={url}
                            controls
                            style={{
                                minWidth: '500px'
                            }}
                            />
                        </div>
                        )}
                    </div>
                </div>
                <div>{this.state.status}</div>
                <div>{this.state.statusMsg}</div>
                <Gallery photos={this.state.photos} />
            </div>
        );
    }
}