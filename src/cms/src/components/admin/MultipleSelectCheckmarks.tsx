import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { WidthFull } from '@mui/icons-material';
import { fetchCommunityTypeAPI,type CachedCommunityTypes } from '../../utils/cacahedData';
import { communityType } from '../../pages/api/communityType';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export default function MultipleSelectCheckmarks(props:any) {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [communityType,setcommunityType] = React.useState<communityType[]>([]);
  const [Type,setType] = React.useState<string[]>([]);
  React.useEffect(()=>{
    const fetchcommunityTypes = async () => {
      const items = await fetchCommunityTypeAPI();
      let temparray : string[] = []
      items.forEach((i) => {
        temparray.push(i.name);
      })
      setcommunityType(items);
      setType(temparray)
      let temppersonArray : string[] =[]
      props.valuefromparent.forEach((element: { name: string; }) => {
        temppersonArray.push(element.name)
      });
      setPersonName(temppersonArray)
    };
    fetchcommunityTypes();
  },[])


  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    //console.log(value)
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
      
    );
    if(typeof value !== 'string'){
      const typetemparray = value
      let somearray : communityType[]= []
      typetemparray.forEach((type)=>{
        const resulttype = communityType.find((comm)=>comm.name === type)
        if(resulttype!==undefined)
        {
        somearray.push(resulttype)
        }
      })
      props.datafromparent(somearray)
      props.validatefromparent("errortype",value)
    }
    


  };

  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="demo-multiple-checkbox-label">Type*</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          required
          onBlur={(e)=>{
            props.validatefromparent("errortype",e.target.value)
          }}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          error={props.errorfromparent}
        >
          {Type.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}