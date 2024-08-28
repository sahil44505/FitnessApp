
export const exerciseOptions = {

	method: 'GET',
	headers: {
		'x-rapidapi-key':'ad3112e82dmshf63ecc4c23d9a5fp171d99jsn3884945232c8',
		'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
	}
};
export const youtubeOptions = {
	method: 'GET',
	headers: {
	  'x-rapidapi-key': 'ad3112e82dmshf63ecc4c23d9a5fp171d99jsn3884945232c8',
	  'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com'
	}
  };
// const url = 'https://exercisedb.p.rapidapi.com/exercises?limit=10&offset=0';


export const fetchData =  async (url,options)=>{
    const response = await fetch(url,options);
    const data = await response.json();

    return data;
}