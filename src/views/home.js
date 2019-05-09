import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import Gallery from "react-photo-gallery";
import axios from 'axios';

const API = 'https://hn.algolia.com/api/v1/search?query=';
const DEFAULT_QUERY = 'redux';
const API2 = 'https://ec83d6qdgc.execute-api.us-east-1.amazonaws.com/stage/search';


export default class Home extends Component {
    state = {
        inputValue: '',
        photos: [],
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
        axios.get(API2, {
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json',
            // },
            params: {
                q: this.state.inputValue
            }
        })
        .then((response) => {
            console.log(response);
            let urls = response.data.results.map(({ url }) => ({'src': url}));
            console.log(urls);
            this.setState({photos: urls});

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