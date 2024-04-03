import React, { useState, useRef } from 'react';
import { AutoComplete, Button } from 'antd';

const class_list = [
    {
        id: "event-CS449",
        title: "CS449 Deep Learning",
        start: ['2024-04-02T09:30:00','2024-04-04T09:30:00'],
        end: ['2024-04-02T11:50:00','2024-04-04T11:50:00'],
        description: 'LEC',
    },
    {
        id: "event-CS496-1",
        title: "CS496-1 Graduate Algorithm",
        start: ['2024-04-02T11:00:00', '2024-04-04T11:00:00'],
        end: ['2024-04-02T12:20:00', '2024-04-04T12:20:00'],
        description: 'Lecture',
    },
    {
        id: "event-CS496-2",
        title: "CS496-2 Graduate Cryptography",
        start: ['2024-04-02T13:00:00', '2024-04-04T13:00:00'],
        end: ['2024-04-02T14:20:00', '2024-04-04T14:20:00'],
        description: 'Lecture',
    }
];



const SearchClassEventButton = ({onEventAdd}) => {

    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);
    const [showSearchBox, setShowSearchBox] = useState(false);

    const match_class_name = (aClassName) => {
        let tmp_list = [];
        class_list.map(
            (item) => {
                if(aClassName.trim().length > 0 && item.title.includes(aClassName))
                {
                    //console.log(item.title, aClassName);
                    tmp_list = [
                        ...tmp_list,
                        {value: item.title}
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
        class_list.map(
            (item) => {
                let tmp_num = 0;
                item.start.map(
                    (start_item) => {
                        if(data.trim().length > 0 && item.title.includes(data))
                        {
                            onEventAdd(
                                {
                                    id: item.id,
                                    title: item.title,
                                    start: item.start[tmp_num],
                                    end: item.end[tmp_num],
                                    description: item.description,
                                }
                            )
                        }
                        tmp_num ++;
                    }
                )
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
        <>
            <Button type="primary" size="large" onClick={onButtonClick}>
                Search for a Class
            </Button>
            {showSearchBox ?
                (<AutoComplete
                    options={options}
                    style={{
                        width: 300,
                    }}
                    onSelect={onSelect}
                    value={value}
                    onChange={onChange}
                    onSearch={(text) => {setOptions(getPanelValue(text));}}
                    placeholder="Search for class"
                />
                ) :(
                    <></>
                )
            }
        </>
    );
};
export default SearchClassEventButton;