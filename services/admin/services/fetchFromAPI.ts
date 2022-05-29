const fetchFromAPI = async (endpointPath: string) =>  {
	const APIRootURL: string = "/admin/service/";

	return await fetch(`${APIRootURL}${endpointPath}`)
				 	.then(response => response.json())
};

export default fetchFromAPI;