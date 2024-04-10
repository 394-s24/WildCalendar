import React, { useState, useRef } from 'react';
import { AutoComplete } from 'antd';
import { Button } from '@/components/Button'

// const class_list = [
//     {
//         id: "event-CS449",
//         title: "CS449 Deep Learning",
//         start: ['2024-04-02T09:30:00','2024-04-04T09:30:00'],
//         end: ['2024-04-02T11:50:00','2024-04-04T11:50:00'],
//         description: 'LEC',
//     },
//     {
//         id: "event-CS496-1",
//         title: "CS496-1 Graduate Algorithm",
//         start: ['2024-04-02T11:00:00', '2024-04-04T11:00:00'],
//         end: ['2024-04-02T12:20:00', '2024-04-04T12:20:00'],
//         description: 'Lecture',
//     },
//     {
//         id: "event-CS496-2",
//         title: "CS496-2 Graduate Cryptography",
//         start: ['2024-04-02T13:00:00', '2024-04-04T13:00:00'],
//         end: ['2024-04-02T14:20:00', '2024-04-04T14:20:00'],
//         description: 'Lecture',
//     }
// ];

const SearchClassEventButton = ({onEventAdd, class_list}) => {

    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);
    const [showSearchBox, setShowSearchBox] = useState(false);

    const match_class_name = (aClassName) => {
        let tmp_list = [];
        Object.entries(class_list).map(
            ([key, _]) => {
                if(aClassName.trim().length > 0 && key.includes(aClassName))
                {
                    //console.log(item.title, aClassName);
                    tmp_list = [
                        ...tmp_list,
                        {value: key}
                    ]
                }
            }
        )
        return tmp_list;
    }

    const getPanelValue = (searchText) =>
    {
        let tmp_list = match_class_name(searchText);
        return !searchText ? [] : tmp_list;
    };

    const onSelect = (data) => {
        Object.entries(class_list).map(
            ([key, item]) => {
                if(key === data)
                {
                    Object.entries(item).map(
                        ([_, item1]) => {
                            //console.log(item1);
                            //const anItem1 = item1; 
                            onEventAdd(item1);
                        }
                    )
                }
            }
        )
        setShowSearchBox(false);
    };

    const onChange = (data) => {
        setValue(data);
    };

    const onButtonClick = () => {
        setShowSearchBox(true);
        setValue('');
        setOptions([]);
    };

    return (
      <AutoComplete
          options={options}
          style={{
              width: 300,
          }}
          onSelect={onSelect}
          value={value}
          onChange={onChange}
          onSearch={(text) => {setOptions(getPanelValue(text));}}
          placeholder="Search for classes"
      />
    );
};
export default SearchClassEventButton;
