import { ChakraStylesConfig } from "chakra-react-select";

export const chakraStyles: ChakraStylesConfig = {
    control: (provided, state) => ({
      ...provided,
      background: 'white',
      border: '1px solid',
      borderColor: 'inherit',
      borderRadius: 'md',
      minWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      height: state.selectProps.size === 'sm' ? '32px' : state.selectProps.size === 'lg' ? '48px' : '40px',
      display: 'flex',
      alignItems: 'center',
    }),
    dropdownIndicator: () => ({
      display: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '200px',
    }),
    option: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: state.selectProps.size === 'sm' ? '32px' : state.selectProps.size === 'lg' ? '48px' : '40px',
      display: 'flex',
      alignItems: 'center',
    }),
    input: (provided, state) => ({
      ...provided,
      height: state.selectProps.size === 'sm' ? '32px' : state.selectProps.size === 'lg' ? '48px' : '40px',
      padding: '0',
      margin: '0',
    }),
    placeholder: (provided) => ({
      ...provided,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    }),
  };