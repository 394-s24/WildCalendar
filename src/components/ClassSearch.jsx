import React, { useState } from "react";
import { AutoComplete } from "antd";

const ClassSearch = () => {
  const [options, setOptions] = useState([]);
  const cs_classes_list = [
    "COMP_SCI 101-0 Computer Science: Concepts, Philosophy, and Connections",
    "COMP_SCI 110-0 Introduction to Computer Programming",
    "COMP_SCI 111-0 Fundamentals of Computer Programming",
    "COMP_SCI 130-0 Tools and Technology of the World-Wide Web",
    "COMP_SCI 150-0 Fundamentals of Computer Programming 1.5",
    "COMP_SCI 211-0 Fundamentals of Computer Programming II",
    "COMP_SCI 212-0 Mathematical Foundations of Comp Science",
    "COMP_SCI 213-0 Introduction to Computer Systems",
    "COMP_SCI 214-0 Data Structures & Algorithms",
    "COMP_SCI 217-0 Data Management & Information Processing",
    "COMP_SCI 260-0 Introduction to Law and Digital Technologies",
    "COMP_SCI 295-0 Special Topics in Computer Science",
    "COMP_SCI 296-0 Intermediate Topics in Computer Science",
    "COMP_SCI 298-0 CS Research Track Program",
    "COMP_SCI 301-0 Introduction to Robotics Laboratory",
    "COMP_SCI 307-0 Introduction to Cryptography",
    "COMP_SCI 310-0 Scalable Software Architectures",
    "COMP_SCI 311-0 Inclusive Making",
    "COMP_SCI 312-0 Data Privacy",
    "COMP_SCI 313-0 Tangible Interaction Design and Learning",
    "COMP_SCI 314-0 Technology and Human Interaction",
    "COMP_SCI 315-0 Design, Technology, and Research",
    "COMP_SCI 321-0 Programming Languages",
    "COMP_SCI 322-0 Compiler Construction",
    "COMP_SCI 323-0 Code Analysis and Transformation",
    "COMP_SCI 324-0 Dynamics of Programming Languages",
    "COMP_SCI 325-0 Artificial Intelligence Programming",
    "COMP_SCI 326-0 Introduction to the Data Science Pipeline",
    "COMP_SCI 327-0 Generative Methods",
    "COMP_SCI 329-0 HCI Studio",
    "COMP_SCI 330-0 Human Computer Interaction",
    "COMP_SCI 331-0 Introduction to Computational Photography",
    "COMP_SCI 332-0 Online Markets",
    "COMP_SCI 333-0 Interactive Information Visualization",
    "COMP_SCI 335-0 Introduction to the Theory of Computation",
    "COMP_SCI 336-0 Design & Analysis of Algorithms",
    "COMP_SCI 337-0 Natural Language Processing",
    "COMP_SCI 338-0 Practicum in Intelligent Information Systems",
    "COMP_SCI 339-0 Introduction to Database Systems",
    "COMP_SCI 340-0 Introduction to Networking",
    "COMP_SCI 341-0 Mechanism Design",
    "COMP_SCI 343-0 Operating Systems",
    "COMP_SCI 344-0 Design of Computer Problem Solvers",
    "COMP_SCI 345-0 Distributed Systems",
    "COMP_SCI 347-0 Conversational AI",
    "COMP_SCI 348-0 Introduction to Artificial Intelligence",
    "COMP_SCI 349-0 Machine Learning",
    "COMP_SCI 350-0 Introduction to Computer Security",
    "COMP_SCI 351-1 Introduction to Computer Graphics",
    "COMP_SCI 351-2 Intermediate Computer Graphics",
    "COMP_SCI 352-0 Machine Perception of Music & Audio",
    "COMP_SCI 354-0 Computer System Security",
    "COMP_SCI 355-0 Digital Forensics and Incident Response",
    "COMP_SCI 367-0 Wireless and Mobile Health: Passive Sensing Data Analytics",
  ];

  const handleSearch = (value) => {
    if (value === '') {
      setOptions([]);
      return;
    }
    const newOptions = cs_classes_list
      .filter((title) => title.toUpperCase().indexOf(value.toUpperCase()) !== -1)
      .map((title) => ({ value: title }));
    setOptions(newOptions);
  }

  const onSelect = (value) => {
    console.log(value)
  }

  return (
    <AutoComplete
      style={{
        width: 200,
      }}
      options={options}
      onSearch={handleSearch}
      onSelect={onSelect}
      placeholder="Search for Classes"
    />
  );
};
export default ClassSearch;
