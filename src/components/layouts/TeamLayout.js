import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container as container } from "./Layouts.js";
import { SectionHeading as heading } from "./Headings.js";

const Heading = tw.div(heading)`text-center`;
const Container = tw.div(container)`mx-auto py-12 lg:pt-8 lg:pb-24`;
const Testimonials = tw.div`flex flex-col xl:flex-row items-center lg:items-stretch`;
const TestimonialContainer = tw.div`mt-16 xl:w-1/3`;
const Testimonial = tw.div`px-4 text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto flex flex-col items-center`;
const Image = tw.img`w-48 h-48 rounded-full`;
const Quote = tw.blockquote`mt-5 text-gray-600 font-medium leading-loose`;
const Position = tw.p`mt-5 text-gray-900 font-semibold uppercase text-sm tracking-wide`;

const TeamLayout = ({
  heading = "Team",
  testimonials = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
      quote:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      position: "MD AND FOUNDER",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
      quote:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      position: "CO-FOUNDER",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1580852300654-03c803a14e24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4.25&w=512&h=512&q=80",
      quote:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      position: "CREATIVE DIRECTOR",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
      quote:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      position: "MARKETING DIRECTOR",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1580852300654-03c803a14e24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4.25&w=512&h=512&q=80",
      quote:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      position: "CFO",
    },
  ],
}) => {
  return (
    <Container>
      <Heading>{heading}</Heading>
      <Testimonials>
        {testimonials.map((testimonial, index) => (
          <TestimonialContainer key={index}>
            <Testimonial>
              <Image src={testimonial.imageSrc} />
              <Position>{testimonial.position}</Position>
              <Quote>"{testimonial.quote}"</Quote>
            </Testimonial>
          </TestimonialContainer>
        ))}
      </Testimonials>
    </Container>
  );
};

export default TeamLayout;
