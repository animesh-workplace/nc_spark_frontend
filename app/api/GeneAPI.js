export function useGeneAPI() {
	// const config = useRuntimeConfig()
	// const BASEURL = `${config.public.API_BASE_URL}`
	const BASEURL = 'http://10.10.6.80/nvpp/api/v1'

	const UploadAPI = async (payload, params) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/upload_variants`, {
				method: 'POST',
				body: payload,
				params: params,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const FilterAPI = async payload => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/get_filtered_variants`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const DistributionAPI = async payload => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${payload}/distributions`, {
				method: 'GET',
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const ReplicationAPI = async payload => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${payload}/replication`, {
				method: 'GET',
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const TrinucleotideAPI = async payload => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${payload}/trinucleotide?mode=count`, {
				method: 'GET',
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	return {
		UploadAPI,
		FilterAPI,
		ReplicationAPI,
		DistributionAPI,
		TrinucleotideAPI,
	}
}
