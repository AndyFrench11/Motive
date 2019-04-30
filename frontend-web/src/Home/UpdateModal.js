import React, { Fragment } from "react";
import _ from 'lodash'
import {Image, Header, Modal, Button, Icon} from "semantic-ui-react";


const UpdateModal = props => (
        <Modal.Content scrolling>

            <Modal.Description>
                <p>Update content will be scrollable here</p>

                {_.times(3, i => (
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed felis eget velit aliquet sagittis id. Sed adipiscing diam donec adipiscing tristique risus nec feugiat in. Consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Senectus et netus et malesuada fames ac. Leo integer malesuada nunc vel risus commodo. Pulvinar mattis nunc sed blandit libero. Sit amet justo donec enim diam. Senectus et netus et malesuada fames ac turpis. Nisi vitae suscipit tellus mauris a. Eu nisl nunc mi ipsum faucibus vitae aliquet. Bibendum arcu vitae elementum curabitur. Pellentesque sit amet porttitor eget dolor morbi non. Justo nec ultrices dui sapien eget mi proin sed. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Viverra vitae congue eu consequat ac felis donec et odio. Arcu vitae elementum curabitur vitae nunc sed. Sit amet mattis vulputate enim nulla.

                        In nisl nisi scelerisque eu ultrices vitae auctor eu augue. Vulputate dignissim suspendisse in est. Sapien et ligula ullamcorper malesuada proin libero nunc. Vitae tempus quam pellentesque nec nam. Enim facilisis gravida neque convallis a cras semper auctor neque. Tincidunt dui ut ornare lectus sit. Pellentesque nec nam aliquam sem et tortor consequat id. Mauris sit amet massa vitae. Magnis dis parturient montes nascetur ridiculus mus. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Et ultrices neque ornare aenean euismod. Eget nunc lobortis mattis aliquam faucibus purus in massa tempor. Nulla porttitor massa id neque aliquam vestibulum morbi blandit.

                        Penatibus et magnis dis parturient. Adipiscing vitae proin sagittis nisl rhoncus mattis. Nunc pulvinar sapien et ligula ullamcorper malesuada proin. Fermentum dui faucibus in ornare quam viverra. Tellus rutrum tellus pellentesque eu tincidunt. Ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit ut aliquam purus. Amet est placerat in egestas erat imperdiet sed euismod nisi. Nibh tellus molestie nunc non blandit massa. Feugiat in fermentum posuere urna nec tincidunt praesent semper. In nibh mauris cursus mattis. Dis parturient montes nascetur ridiculus mus. Habitant morbi tristique senectus et netus. Eget sit amet tellus cras adipiscing enim eu. Aliquet eget sit amet tellus cras adipiscing enim eu turpis.

                        Platea dictumst quisque sagittis purus sit amet. Fermentum iaculis eu non diam phasellus vestibulum lorem sed risus. Ullamcorper malesuada proin libero nunc consequat interdum varius sit amet. Mi sit amet mauris commodo quis imperdiet massa tincidunt. In hac habitasse platea dictumst quisque sagittis purus. Sapien eget mi proin sed libero enim sed faucibus. Sit amet est placerat in egestas. Sed cras ornare arcu dui vivamus arcu felis. Nisl purus in mollis nunc. Nisl purus in mollis nunc sed id. Dictum varius duis at consectetur. Odio eu feugiat pretium nibh ipsum. Nisl suscipit adipiscing bibendum est. Est velit egestas dui id. Nisl pretium fusce id velit ut tortor. Consectetur adipiscing elit ut aliquam purus sit. Donec enim diam vulputate ut pharetra. Integer malesuada nunc vel risus commodo viverra maecenas accumsan. Laoreet id donec ultrices tincidunt arcu non. Bibendum enim facilisis gravida neque convallis a cras.

                        Egestas dui id ornare arcu odio ut sem. Mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus. Faucibus ornare suspendisse sed nisi. A diam maecenas sed enim. In hendrerit gravida rutrum quisque non tellus orci. Interdum velit laoreet id donec ultrices tincidunt. Pharetra et ultrices neque ornare aenean euismod elementum nisi. Augue neque gravida in fermentum. Pulvinar pellentesque habitant morbi tristique. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Facilisis mauris sit amet massa vitae tortor condimentum lacinia quis. Consequat interdum varius sit amet mattis vulputate. Nibh tellus molestie nunc non blandit. Elementum nisi quis eleifend quam. Aliquet porttitor lacus luctus accumsan tortor. Orci porta non pulvinar neque laoreet suspendisse. Turpis nunc eget lorem dolor sed viverra ipsum.</p>
                ))}
            </Modal.Description>
        </Modal.Content>
);

export default UpdateModal;

