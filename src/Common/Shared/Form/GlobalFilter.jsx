import React from 'react'
// import '../../../node_modules/font-awesome/css/font-awesome.min.css';


const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <div className='form-group float-right  textOnInput global-filter  Expanded'  >
      <label > جستجو</label>
      <input className='form-control opacityForInput' placeholder='&#xF002;' type='text' value={filter}
        onChange={e => setFilter(e.target.value)} />
    </div>
  )
}

export default GlobalFilter