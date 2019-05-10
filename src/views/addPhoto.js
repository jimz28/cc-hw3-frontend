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
    loading: false,
    status: ''
}

handleFileChange = async event => {
  if (!!event.target.files[0]) {

    const file = event.target.files[0];
    const fileName = file.name;
    const options = {
      headers: {
        'Content-Type': file.type
      }
    };
    console.log(event.target.files[0]);

    await this.setState({
      imageURL: URL.createObjectURL(file),
      loading: true
    });

    axios.put(`https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/upload2/${fileName}`, file, options)
    .then((response) => {
      console.log(response);
      this.setState({status: 'uploaded successfully'});
    })
    .catch(function (error) {
        console.log(error);
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
        <div>{this.state.status}</div>
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