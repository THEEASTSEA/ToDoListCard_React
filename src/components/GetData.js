// 데이터를 가져오는 비동기 함수 정의
const GetData = async () => {
  // API에 GET 요청을 보내 데이터를 가져옴
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'KDT5_nREmPe9B', // API 키를 헤더에 추가
      'username': 'KDT5_ParkYoungWoong' // 사용자 이름을 헤더에 추가
    }
  })
  // 응답을 JSON 형식으로 파싱하여 변수에 저장
  const json = await res.json()
  // 가져온 데이터 반환
  return json
}
export default GetData
