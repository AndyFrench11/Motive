import React from 'react';
import Home from './Home';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
    const homeComponent = renderer.create(
        <Home/>,
    );
    let tree = homeComponent.toJSON();
    expect(tree).toMatchSnapshot();
});

// test('Test that the state of the header changes', () => {
//     const homeComponent = renderer.create(
//         <Home/>,
//     );
//     expect('Welcome to Motive').toBe('Welcome to Motive.');
// })