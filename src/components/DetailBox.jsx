/* global kakao */
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useOutletContext } from "react-router-dom";

import SearchableSelect from "./SearchableSelect";
import MultiSearchableSelect from "./MultiSearchableSelect";

const DEFAULT_MAP_LAT = 37.247802986015444;
const DEFAULT_MAP_LON = 127.07835712572654;

export default function DetailBox({
  data,
  metaData = [],
  onApprove,
  approveTitle = "인증 수락",
  onReject,
  rejectTitle = "인증 거절"
}) {  
  const { setToast } = useOutletContext();
  const [inputs, setInputs] = useState(() => {
    const init = {};
    metaData.forEach(({ type, label, isEditable }) => {
      if (type === "map") {
        init.lat = data.lat || DEFAULT_MAP_LAT;
        init.lon = data.lon || DEFAULT_MAP_LON;
      }

      if (isEditable && data[label] !== undefined) {
        init[label] = data[label];
      }
    });
    
    return init;
  });
  const [localImages, setLocalImages] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");

  // data를 input으로
  const resetData = () => {
    const init = {};
    metaData.forEach(({ type, label, isEditable }) => {
      if (type === "map") {
        init.lat = data.lat || DEFAULT_MAP_LAT;
        init.lon = data.lon || DEFAULT_MAP_LON;
      }

      if (isEditable && data[label] !== undefined) {
        init[label] = data[label];
      }
    });
    
    setInputs(init);
  };

  useEffect(resetData, [data]);


  const handleChange = (label, value) => {
    setInputs(prev => ({ ...prev, [label]: value }));
  };

  const handleImageChange = (label, file) => {
    const previewUrl = URL.createObjectURL(file);
    setLocalImages(prev => ({ ...prev, [label]: previewUrl }));
    setInputs(prev => ({ ...prev, [label]: file }));
  };

  const handleSearchKeyword = () => {
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const place = data[0];
        handleChange("lat", place.y);
        handleChange("lon", place.x);
        handleChange("name", place.place_name);
        handleChange("category", place.category_name);
        handleChange("url", place.place_url);
      } else {
        setToast({ message: "검색 결과가 없습니다.", isSuccess: false });
      }
    });
  };

  return (
    <Box>
      <Title>상세 정보</Title>

      <Rows>
        {metaData.map(({ title, label, type, options, isEditable }) => {
          console.log(`inputs: ${inputs}`);
          console.log(`data: ${data}`);
          const value = inputs[label] ?? data[label];

          if (type === "big-image") {
            return (
              <div key={label} style={{ textAlign: "center", marginBottom: "16px" }}>
                <img src={value} alt={label} style={{ width: "300px", borderRadius: 8 }} />
              </div>
            );
          }

          if (type === "map") {
            return (
              <div key={label}>
                <Row>
                  <Label>가게 검색</Label>
                  <Input
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchKeyword();
                      }
                    }}
                  />
                </Row>
                <div style={{ marginBottom: "16px", borderRadius: 8, overflow: "hidden" }}>
                  <Map
                    center={{
                      lat: inputs.lat || DEFAULT_MAP_LAT,
                      lng: inputs.lon || DEFAULT_MAP_LON
                    }}
                    style={{ width: "100%", height: "360px" }}
                    onClick={(_, mouseEvent) => {
                      const latlon = mouseEvent.latLng;
                      handleChange("lat", latlon.getLat());
                      handleChange("lon", latlon.getLng());
                    }}
                  >
                    <MapMarker
                      position={{
                        lat: inputs.lat || DEFAULT_MAP_LAT,
                        lng: inputs.lon || DEFAULT_MAP_LON
                      }}
                    />
                  </Map>
                </div>
              </div>
            );
          }

          return (
            <Row key={label}>
              <Label>{title}</Label>
              <Value>
                {isEditable ? (
                  type === "image" ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
                      <img
                        src={localImages[label] || value}
                        alt={label}
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: 8,
                          objectFit: "cover"
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            handleImageChange(label, e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  ) : type === "text" ? (
                    <Input
                      type="text"
                      value={value || ""}
                      onChange={e => handleChange(label, e.target.value)}
                      placeholder={label}
                    />
                  ) : type === "textarea" ? (
                    <Textarea
                      value={value || ""}
                      onChange={e => handleChange(label, e.target.value)}
                      placeholder={label}
                    />
                  ) : type === "date" ? (
                    <Input
                      type="date"
                      value={value ? new Date(value).toISOString().split("T")[0] : ""}
                      onChange={e => handleChange(label, e.target.value)}
                      placeholder={label}
                    />
                  ) : type === "select" ? (
                    <SearchableSelect
                      value={value || ""}
                      onChange={(val) => handleChange(label, val)}
                      options={options}
                    />
                  ) : type === "multi-select" ? (
                    <MultiSearchableSelect
                      value={value || []}
                      onChange={(val) => handleChange(label, val)}
                      options={options}
                    />
                  ) : null
                ) : type === "date" ? (
                  value ? new Date(value).toLocaleString("ko-KR") : "-"
                ) : type === "boolean" ? (
                  value ? "O" : "X"
                ) : type === "image" ? (
                  <img
                    src={value}
                    alt={label}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: 8,
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  value ?? "-"
                )}
              </Value>
            </Row>
          );
        })}
      </Rows>

      {(onApprove || onReject) && (
        <ButtonRow>
          {onReject && <RedButton onClick={() => onReject(data)}>{rejectTitle}</RedButton>}
          {onApprove && <BlueButton onClick={() => onApprove({ ...data, ...inputs })}>{approveTitle}</BlueButton>}
        </ButtonRow>
      )}
    </Box>
  );
}


const Box = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-left: 20px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: bold;
  padding: 16px;
  border-bottom: 1px solid #ddd;
`;

const Rows = styled.div`
  padding: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-weight: bold;
  width: 150px;
`;

const Value = styled.div`
  flex: 1;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const Textarea = styled.textarea`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
`;


const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 16px 16px;
`;

const RedButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const BlueButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
