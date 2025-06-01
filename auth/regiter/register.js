//SIGN UP
const agreeToTerms = document.getElementById('agreeToTerms');
const submitBtn = document.querySelector('.btn-full.btn-primary');

console.log(submitBtn)
if(agreeToTerms.checked){
  console.log('checked');
  submitBtn.disabled = true;
}

const registerForm = document.querySelector('#registerForm');
console.log(registerForm)
registerForm.addEventListener('submit',function(e){
  e.preventDefault();
  const formData = new formData(this);
  console.log(formData)
})
