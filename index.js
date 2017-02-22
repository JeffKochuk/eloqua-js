/**
 * Created by jkochuk on 2/21/17.
 */
import fetch from 'node-fetch';
    
const BASE_REST_URL = 'https://secure.p01.eloqua.com';

export default class Eloqua {

    //Creates an Eloqua object which stores the authorization given.
    //@param authString like 'basic ########################'
    constructor(authString) {
        this.eloquaOptions = {
            headers: {
                authorization: authString
            }
        };
    }
    
    // Given the rest endpoint, get all pages and concatenate the elements into a single array
    // @param URL like /REST/
    // @return Promise<Array<Object>> of Eloqua element JSON objects.
    getPagesAsArray(URL) {
        const fullURL = `${BASE_REST_URL}${URL}${URL.contains('?') ? '' : '?'}`;
        let allElements = [];
        return fetch(fullURL, this.eloquaOptions)
            .then(res => res.json())
            .then(({ total, pageSize, elements }) => {
                allElements = elements;
                const numPagesToGet = parseInt(total, 10) / parseInt(pageSize, 10);
                if (numPagesToGet > 1) {
                    const pagesArray = [];
                    for (let i = 1; i < numPagesToGet; i++) {
                        pagesArray.push(
                            fetch(`${fullURL}&page=${i + 1}`, this.eloquaOptions)
                                .then(res => res.json())
                                .then(({ elements }) => allElements = allElements.concat(elements))
                        );
                    }
                    return Promise.all(pagesArray).then(() => allElements);
                } else {
                    return allElements;
                }
            });
    }

    // Given the rest endpoint, get all pages and pass the { elements } values to the handleFunc
    // @param URL second half of the rest URL like '/API/REST/2.0/data/contact/view/100081/contacts/segment'
    // @param handleFunc Function will be called for each page, and will be provided the { elements } array
    // @return Promise<void>
    getAllPagesAndHandle(URL, handleFunc) {
        const fullURL = `${BASE_REST_URL}${URL}${URL.contains('?') ? '' : '?'}`;
        return fetch(fullURL, this.eloquaOptions)
            .then(res => res.json())
            .then(({ total, pageSize, elements }) => {
                const numPagesToGet = parseInt(total, 10) / parseInt(pageSize, 10);
                if (numPagesToGet > 1) {
                    const pagesArray = [];
                    for (let i = 1; i < numPagesToGet; i++) {
                        pagesArray.push(
                            fetch(`${fullURL}&page=${i + 1}`, this.eloquaOptions)
                                .then(res => res.json())
                                .then(({ elements }) => handleFunc(elements))
                        );
                    }
                    return Promise.all(pagesArray).then(() => handleFunc(elements));
                } else {
                    return handleFunc(elements);
                }
            });
    }
}