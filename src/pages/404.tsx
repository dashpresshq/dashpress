import React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Error404SVG from '../../public/assets/images/Error404SVG';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Heading = styled.h1`
  font-size: 4.25rem;
  font-weight: bold;
  color: #333;
  margin-top: 3rem;
  font-family: 'Marker Felt', Fantasy;
  margin-bottom: 1rem;
`;

const SubHeading = styled.p`
  font-size: 1.7rem;
  color: #333;
  font-weight: bold;
  font-family: 'Marker Felt', Fantasy;
`;

const StyledLink = styled.a`
  font-size: 1rem;
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
  text-decoration: none;
  font-family: 'Marker Felt', Fantasy;
`;

function Custom404(): JSX.Element {
  return (
    <Container>
      <Content>
        <Error404SVG />

        <Heading>PAGE NOT FOUND</Heading>
        <SubHeading>
          SORRY, THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND
        </SubHeading>

        <div>
          <StyledLink href="/">Go to Home</StyledLink>
        </div>
      </Content>
    </Container>
  );
}

export default dynamic(() => Promise.resolve(Custom404), { ssr: false });
