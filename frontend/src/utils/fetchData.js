
export const exerciseOptions = {

	method: 'GET',
	headers: {
		'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY ,
		'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
	}
};
export const youtubeOptions = {
	method: 'GET',
	headers: {
	  'x-rapidapi-key': import.meta.env.VITE_RAPID_YT_API_KEY,
	  'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com'
	}
  };
// const url = 'https://exercisedb.p.rapidapi.com/exercises?limit=10&offset=0';


export const fetchData =  async (url,options)=>{
    const response = await fetch(url,options);
    const data = await response.json();

    return data;
}