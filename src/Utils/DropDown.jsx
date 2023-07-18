


import Select from 'react-select'


const DropDown = (props) => {
    const options = props.multi
      ? [{ label: "همه", value: "all" }, ...props.options]
      : props.options;
  
    return (
      <div className={`react-select-wrapper ${props.multi ? "multi" : ""}`}>
        <Select
          name="example"
          placeholder={props.placeholder}
          options={options}
          isMulti
          value={props.value ? props.value : null}
          onChange={selected => {
            props.multi &&
            selected.length &&
            selected.find(option => option.value === "all")
              ? props.handleChange(options.slice(1))
              : !props.multi
                ? props.handleChange((selected && selected.value) || null)
                : props.handleChange(selected);
          }}
        />
      </div>
    );
  };

export default DropDown
  