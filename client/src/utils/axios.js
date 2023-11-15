import axios from "axios";
import { baseUrl } from "./Constants";
axios.defaults.withCredentials=true;

const instance= axios.create({
    baseURL:baseUrl,
    
})


export default instance