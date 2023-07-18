 import React from 'react'
 
 const CheckBox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" className='tarikh' ref={resolvedRef} {...rest} />
      </>
    );
  }
);
 
 export default CheckBox