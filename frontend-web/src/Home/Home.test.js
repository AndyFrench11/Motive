import React from 'react';
import Landing from './Home';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
    const homeComponent = renderer.create(
        <Landing/>,
    );
    let tree = homeComponent.toJSON();
    expect(tree).toMatchSnapshot();
});

// test('Test that the state of the header changes', () => {
//     const homeComponent = renderer.create(
//         <OLD.Landing/>,
//     );
//     expect('Welcome to Motive').toBe('Welcome to Motive.');
// })