export const loginScript = `
const form=document.querySelector('#login'),status=document.querySelector('#status'),button=document.querySelector('#submit');
if(new URLSearchParams(location.search).has('error'))status.textContent='That link is invalid or has expired. Request a new one below.';
form.addEventListener('submit',async event=>{event.preventDefault();button.disabled=true;status.textContent='Sending your sign-in link…';try{const response=await fetch('/api/login/sign-in/magic-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.email.value.trim(),callbackURL:'/inbox',errorCallbackURL:'/login'})});if(!response.ok)throw new Error();status.textContent='If this address has access, a sign-in link is on its way. Check your inbox and spam folder.';}catch{status.textContent='We couldn’t send the link. Please try again in a minute.';}finally{button.disabled=false;}});
`;
