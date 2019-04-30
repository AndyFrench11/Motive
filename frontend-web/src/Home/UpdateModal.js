import React, { Fragment } from "react";
import {Image, Header, Modal, Item, Placeholder} from "semantic-ui-react";

const ModalTitle = () => (
    <Item>
        <Item.Content>
            <Item.Header>Update from John</Item.Header>
            <Item.Meta>
                <span>Date</span>
            </Item.Meta>
            <Item.Description>
                <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Paragraph>
            </Item.Description>
        </Item.Content>
    </Item>

);

const UpdateModal = props => (
        <Modal.Content scrolling>

            <Modal.Description>
                <Item.Group>
                    <ModalTitle/>
                </Item.Group>
                <Placeholder>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Paragraph>
                </Placeholder>
            </Modal.Description>
        </Modal.Content>
);

export default UpdateModal;

