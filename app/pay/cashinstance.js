
import axios from 'axios';
const timestamp = Date.now();
const cashinstance = axios.create({
    baseURL: 'https://www.tamkeen.com.ye:33291/CashPG/', 
    headers: {
        'Content-Type': 'application/json',
        'encPassword': 'jmPY8kvUoDZR3fHo6M1Yu2bnxbessQ27',
        'unixtimestamp': timestamp
    }
    
});

export default cashinstance;