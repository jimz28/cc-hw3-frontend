import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import Gallery from "react-photo-gallery";
import axios from 'axios';


export default class Home extends Component {
    state = {
        inputValue: '',
        photos: null,
    };

    // let photoList = [];

    handleInputChange = (event) => {
        this.setState({inputValue: event.target.value});
    }

    handleFormSubmit = (event) => {
        console.log(this.state.inputValue);
        axios.get("https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/search", {
            params: {
                q: this.state.inputValue
            }
        })
        .then((response) => {
            console.log(response);
            let urls = response.results.map(({ url }) => url);
            let photos = []
            for (let url in urls) {
                photos.push({src: url});
            }
            this.setState({photos: photos});

        })
        .catch(function (error) {
            console.log(error);
        });
        event.preventDefault();
    };

    // handlePhotoOutput = () => {
    //     response.data.map(key => {
    //         photoList.push({
    //             src: s3Url + key
    //         })
    //     })
    // };

    render() {
        return (
            <div>
                <form class="form-inline md-form form-sm mt-0" onSubmit={this.handleFormSubmit} onChange={this.handleInputChange}>
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <input class="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" />
                </form>
                <Gallery photos={this.state.photos} />
            </div>
        );
    }
}