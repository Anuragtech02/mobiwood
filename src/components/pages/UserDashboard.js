import React from "react";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import Nav from "../layouts/NewNav";
import tw from "twin.macro";
import styled from "styled-components";
import { ReactComponent as MapPin } from "feather-icons/dist/icons/map-pin.svg";
import { ReactComponent as AwardIcon } from "feather-icons/dist/icons/award.svg";
import { ReactComponent as LikeIcon } from "feather-icons/dist/icons/thumbs-up.svg";
import { ReactComponent as DollarIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import { ReactComponent as EyeIcon } from "feather-icons/dist/icons/eye.svg";
import { ReactComponent as ShareIcon } from "feather-icons/dist/icons/send.svg";
import { ReactComponent as GraphIcon } from "feather-icons/dist/icons/trending-up.svg";
import Footer from "../layouts/Footer";
import { css } from "styled-components/macro"; //eslint-disable-line

const Content = tw.div`flex flex-col lg:flex-row pt-6 px-2 sm:px-8 overflow-x-hidden bg-purple-100`;
const LeftContent = tw.div`w-full lg:w-1/2`;
const RightContent = tw.div`w-full lg:w-1/2`;
const ProfileInfo = tw.div`flex flex-col sm:flex-row justify-between`;
const ProfileLeft = tw.div`flex flex-col sm:flex-row`;
const OtherInfo = tw.div`flex flex-col m-2 sm:mx-4`;
const ProfileName = tw.div`font-semibold text-3xl`;
const Location = tw.div`flex flex-row text-sm -ml-1`;
const Age = tw.div`text-sm m-2 ml-1`;
const AwardInfo = tw.div`my-2 w-full flex flex-col sm:flex-row justify-between border-b border-gray-400`;
const Award = tw.div`sm:w-1/3 my-3 flex flex-row justify-between sm:justify-start`;
const AwardText = tw.div`mr-2 text-right sm:text-left sm:ml-12`;
const Line1 = tw.div`font-semibold`;
const Line2 = tw.div``;

const ProfileRight = tw.div`sm:m-2 flex flex-row`;
const Button = tw.div`mx-2 px-5 text-white hocus:bg-button-200 cursor-pointer rounded-full py-2 bg-button-100 h-8 text-xs`;

const ProfileImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`bg-cover bg-center h-28 w-28 rounded-full mx-2`,
]);

const Flex = tw.div`flex flex-col lg:flex-row border-b border-gray-400  last:border-b-0`;

const Data = tw.div`py-5`;
const DataHeading = tw.div`sm:mx-4 mb-4 mt-2 flex flex-row font-bold text-gray-900`;
const DataTable = tw.div`bg-white flex flex-col shadow sm:mx-4`;
const Row = tw.div`p-3 flex first:border-t border-b flex-row justify-between`;
const Col = tw.div`text-xs`;

const UserDashboard = () => {
  return (
    <AnimationRevealPage disabled>
      <Nav />
      <Content>
        <LeftContent tw="lg:p-4">
          <ProfileInfo>
            <ProfileLeft>
              <ProfileImage
                imageSrc={
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80"
                }
              />
              <OtherInfo>
                <ProfileName>Christina Justin</ProfileName>
                <Location>
                  <MapPin tw="h-4 mt-1" />
                  New York, USA
                </Location>
                <Age>28/F</Age>
              </OtherInfo>
            </ProfileLeft>
            <ProfileRight>
              <Button>Edit</Button>
            </ProfileRight>
          </ProfileInfo>
          <AwardInfo>
            <Award>
              <AwardIcon tw="h-12 w-12 text-gray-600" />
              <AwardText>
                <Line1>5 Awards</Line1>
                <Line2>Achieved</Line2>
              </AwardText>
            </Award>
            <Award>
              <LikeIcon tw="h-12 w-12 text-gray-600" />
              <AwardText>
                <Line1>1.5M</Line1>
                <Line2>Likes</Line2>
              </AwardText>
            </Award>
            <Award>
              <DollarIcon tw="h-12 w-12 text-gray-600" />
              <AwardText>
                <Line1>1244</Line1>
                <Line2>Earnings</Line2>
              </AwardText>
            </Award>
          </AwardInfo>
          <Flex>
            <LeftContent>
              <Data>
                <DataHeading>
                  <LikeIcon />
                  &nbsp;Likes
                </DataHeading>
                <DataTable>
                  <Row>
                    <Col>Daily</Col>
                    <Col>20K</Col>
                  </Row>
                  <Row>
                    <Col>Weekly</Col>
                    <Col>140K</Col>
                  </Row>
                  <Row>
                    <Col>Monthly</Col>
                    <Col>700K</Col>
                  </Row>
                </DataTable>
              </Data>
            </LeftContent>
            <RightContent>
              <Data>
                <DataHeading>
                  <EyeIcon />
                  &nbsp;Views
                </DataHeading>
                <DataTable>
                  <Row>
                    <Col>Daily</Col>
                    <Col>50k</Col>
                  </Row>
                  <Row>
                    <Col>Weekly</Col>
                    <Col>300K</Col>
                  </Row>
                  <Row>
                    <Col>Monthly</Col>
                    <Col>1.2M</Col>
                  </Row>
                </DataTable>
              </Data>
            </RightContent>
          </Flex>
          <Flex>
            <LeftContent>
              <Data>
                <DataHeading>
                  <ShareIcon />
                  &nbsp;Shares
                </DataHeading>
                <DataTable>
                  <Row>
                    <Col>Daily</Col>
                    <Col>1k</Col>
                  </Row>
                  <Row>
                    <Col>Weekly</Col>
                    <Col>7k</Col>
                  </Row>
                  <Row>
                    <Col>Monthly</Col>
                    <Col>40K</Col>
                  </Row>
                </DataTable>
              </Data>
            </LeftContent>
            <RightContent>
              <Data>
                <DataHeading>
                  <GraphIcon />
                  &nbsp; Position on Chart
                </DataHeading>
                <DataTable>
                  <Row>
                    <Col>Video 1</Col>
                    <Col>700</Col>
                  </Row>
                  <Row>
                    <Col>Video 2</Col>
                    <Col>400</Col>
                  </Row>
                  <Row>
                    <Col>Video 3</Col>
                    <Col>100</Col>
                  </Row>
                </DataTable>
              </Data>
            </RightContent>
          </Flex>
        </LeftContent>
        <RightContent>
          <Flex>
            <LeftContent>
              <Data>
                <DataHeading>
                  <GraphIcon />
                  &nbsp; Age Demographics
                </DataHeading>
                <DataTable>
                  <Row>
                    <Col>18-30</Col>
                    <Col>10k</Col>
                  </Row>
                  <Row>
                    <Col>30-50</Col>
                    <Col>300K</Col>
                  </Row>
                  <Row>
                    <Col>50-80</Col>
                    <Col>5K</Col>
                  </Row>
                </DataTable>
              </Data>
            </LeftContent>
            <RightContent>
              <Data>
                <DataHeading>
                  <DollarIcon /> Ads Monetized
                </DataHeading>
                <DataTable>
                  <Row>
                    <Col>Monday</Col>
                    <Col>70 Ads</Col>
                  </Row>
                  <Row>
                    <Col>Tuesday</Col>
                    <Col>80 Ads</Col>
                  </Row>
                  <Row>
                    <Col>Wednesday</Col>
                    <Col>70 Ads</Col>
                  </Row>
                </DataTable>
              </Data>
            </RightContent>
          </Flex>
          <Flex>
            <LeftContent>
              <Data>
                <DataHeading>
                  <DollarIcon /> Monthly Earnings
                </DataHeading>
                <DataTable>
                  <Row>
                    <Col>January</Col>
                    <Col>122K</Col>
                  </Row>
                  <Row>
                    <Col>February</Col>
                    <Col>300K</Col>
                  </Row>
                  <Row>
                    <Col>March</Col>
                    <Col>100K</Col>
                  </Row>
                </DataTable>
              </Data>
            </LeftContent>
          </Flex>
        </RightContent>
      </Content>
      <Footer />
    </AnimationRevealPage>
  );
};

export default UserDashboard;
