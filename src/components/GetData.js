const GetData = async () => {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'KDT5_nREmPe9B',
      'username': 'KDT5_ParkYoungWoong'
    }
  })
  const json = await res.json()
  console.log(json)

  return json
}
export default GetData
