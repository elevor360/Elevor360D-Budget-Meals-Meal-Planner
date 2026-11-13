(()=>{
const key='elevor360d_budget_tracker_v1';
let state={weekly:'',expenses:[]};
try{const x=JSON.parse(localStorage.getItem(key)||'null');if(x&&Array.isArray(x.expenses))state=x;}catch{}
const $=id=>document.getElementById(id),money=n=>'£'+Number(n).toFixed(2);
function persist(){localStorage.setItem(key,JSON.stringify(state));render();}
function render(){
$('weeklyBudget').value=state.weekly;
const total=state.expenses.reduce((s,e)=>s+Number(e.amount),0);
const budget=Number(state.weekly)||0;
$('budgetSummary').textContent='Spent: '+money(total)+' | Remaining: '+money(budget-total)+(budget&&total>budget?' — Over budget':'');
const list=$('expenseList');list.replaceChildren();
state.expenses.forEach((e,i)=>{
const row=document.createElement('div');row.className='row between';row.style.padding='7px 0';
const txt=document.createElement('span');txt.textContent=e.name+' — '+money(e.amount);
const btn=document.createElement('button');btn.type='button';btn.className='ghost';btn.textContent='Remove';
btn.addEventListener('click',()=>{state.expenses.splice(i,1);persist()});
row.append(txt,btn);list.append(row);
});
}
$('weeklyBudget').addEventListener('change',()=>{state.weekly=$('weeklyBudget').value;persist()});
$('addExpense').addEventListener('click',()=>{
const name=$('expenseName').value.trim(),amount=Number($('expenseAmount').value);
if(!name||!Number.isFinite(amount)||amount<=0){alert('Enter a name and an amount greater than zero.');return;}
state.expenses.push({name,amount:Number(amount.toFixed(2))});$('expenseName').value='';$('expenseAmount').value='';persist();
});
$('exportBudget').addEventListener('click',()=>{
const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));
const a=document.createElement('a');a.href=url;a.download='Elevor360D-Budget-Backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('importBudget').addEventListener('change',async e=>{
const f=e.target.files?.[0];if(!f)return;
try{const x=JSON.parse(await f.text());if(!Array.isArray(x.expenses)||x.expenses.some(y=>typeof y.name!=='string'||!Number.isFinite(Number(y.amount))||Number(y.amount)<0))throw Error('Invalid budget file');
if(confirm('Replace your current budget entries with this backup?')){state={weekly:String(x.weekly||''),expenses:x.expenses};persist();}}
catch{alert('Could not read that budget backup.')}e.target.value='';
});
render();
})();