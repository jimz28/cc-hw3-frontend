import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {} from '../api/photo';
import axios from 'axios';


class AddPhoto extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { ...INIT_STATE};
//   }

state = {
    imageURL: null,
    loading: false
}

handleFileChange = async event => {
  if (!!event.target.files[0]) {
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
  }
};

render() {
    const { imageURL } = this.state;

    return (
      <div>
        <input
          id="myFileUpload"
          type="file"
          onChange={this.handleFileChange}
          accept=".jpg, .jpeg, .png"
        />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute' }}>
            <img src={imageURL} alt="imageURL" class="rounded mx-auto d-block"/>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AddPhoto);