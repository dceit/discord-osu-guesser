import axios from 'axios';
const { API_BASE_DOMAIN, API_TOKEN } = process.env

export function getUserByQuery(
	query,
	limit=1,
	endpoint='/api/users/search'
	) {

	if(query == null) {
		return null;
	}

	return new Promise(async (resolve, reject) => {
		await axios.get(API_BASE_DOMAIN + endpoint,
	    	{
	    		headers: { 'X-API-Key': API_TOKEN, },
	    		params: {
			        query: query,
			        limit: limit
			    }
	    	})
	        .then(response => {
	        	if(!response.data.success)
	        		return reject('ERROR: API returned failed success. Aborting.')

	        	if(!response.data.data)
	        		return reject('ERROR: Data not returning from endpoint. Aborting.')

	        	if(response.data.data.length == 0)
	        		return reject('ERROR: No users found with this query. Aborting.')

	        	return resolve(response.data.data[0]);
	        })
	        .catch(error => reject(`ERROR: Something went wrong. Is the website online?`));
	});
}

export function getLeaderBoardData(
		mode, 
		variant,
		limit=10,
		endpoint='/api/games/leaderboard'
	) {

	if(mode == null || variant == null) {
		return null;
	}

	return new Promise(async (resolve, reject) => {
		await axios.get(API_BASE_DOMAIN + endpoint,
	    	{
	    		headers: { 'X-API-Key': API_TOKEN, },
	    		params: {
			        mode: mode,
			        variant: variant,
			        limit: limit
			    }
	    	})
	        .then(response => {
	        	if(!response.data.success)
	        		return reject('ERROR: API returned failed success. Aborting.')

	        	if(!response.data.data)
	        		return reject('ERROR: Data not returning from endpoint. Aborting.')

	        	return resolve(response.data.data);
	        })
	        .catch(error => reject(`ERROR: Something went wrong. Is the website online?`));
	});
}