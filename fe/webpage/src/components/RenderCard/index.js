import React from "react";
import { Button, Flex, Col, Row } from "antd";

const RenderCard = ({ children, onToggle, onHistory, onAdd, onDelete }) => {
  return (
    <div className="boxAlarm">
      <Flex>
        <div style={{ width: "50%", height: "150px" }}>{children}</div>
        <Row
          className="alarmBtn"
          gutter={[10, 0]}
          justify="space-around"
          align="middle"
          style={{ width: "50%", height: "150px" }}
        >
          <Col>
            <Button type="primary" size="large" onClick={onToggle}>
              ON/OFF
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large" onClick={onHistory}>
              History
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large" onClick={onAdd}>
              Add
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large" onClick={onDelete}>
              Delete
            </Button>
          </Col>
        </Row>
      </Flex>
    </div>
  );
};

export default RenderCard;
