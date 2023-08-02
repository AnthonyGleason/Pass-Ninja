export const verifyToken = async function(token:string){
  const response = await fetch('http://localhost:5000/v1/api/vaults/verify',{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });
  const data = await response.json();
  return data.isValid;
};