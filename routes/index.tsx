/** @jsx jsx */
import { jsx } from "@theme-ui/core";
// /** @jsx h */
// import { h } from "preact";
import {
  SystemContainer,
  Button,
  LayoutSidebar,
  LayoutSidebarHeader,
  Heading,
  LayoutSidebarBody,
  LayoutNavigation,
  LayoutNavigationItem,
  LayoutNavigationGroup,
  LayoutMainNavbar,
  Breadcrumbs,
  Account,
  LayoutMainFooter,
  Anchor,
  Layout,
  LayoutMain,
  BreadcrumbsHome,
  LayoutMainHeader,
  BreadcrumbsItem,
  Box,
  LayoutMainBody,
  TabGroup,
  TabOption,
} from "delta-ui-kit";
import { ComponentChildren, Fragment } from "preact";
import { MdOutlineSettings, MdOutlineSpaceDashboard } from "react-icons-md";
import { Head } from "$fresh/runtime.ts";
import { useTranslation } from "react-i18next";
import { ChestsContext } from "../utils/chests.tsx";
import Counter from "../islands/Counter.tsx";
import { createChests } from "../utils/chests.tsx";
import { CountHeading } from "../components/Heading.tsx";

const sidebar = (
  <LayoutSidebar>
    <LayoutSidebarHeader>
      {/* <SiDeno
        sx={{
          width: '2rem',
          height: '2rem',
          verticalAlign: 'middle',
        }}
      /> */}
      <Heading level={3}>Brand</Heading>
    </LayoutSidebarHeader>
    <LayoutSidebarBody>
      <LayoutNavigation activeId="0-1">
        <LayoutNavigationItem icon={MdOutlineSpaceDashboard} id="0-1">
          Dashboard
        </LayoutNavigationItem>
        <LayoutNavigationItem icon={MdOutlineSettings} id="0-2">
          Settings
        </LayoutNavigationItem>
        <LayoutNavigationGroup title="Group 1">
          <LayoutNavigationItem id="1-0">Devices</LayoutNavigationItem>
          <LayoutNavigationItem id="1-1">Rooms</LayoutNavigationItem>
        </LayoutNavigationGroup>
        <LayoutNavigationGroup title="Group 2">
          <LayoutNavigationItem id="2-0">Racks</LayoutNavigationItem>
          <LayoutNavigationItem id="2-1">Display</LayoutNavigationItem>
          <LayoutNavigationItem id="2-2">Interface</LayoutNavigationItem>
        </LayoutNavigationGroup>
      </LayoutNavigation>
    </LayoutSidebarBody>
  </LayoutSidebar>
);

const navbar = (breadcrumbsItems = null as ComponentChildren) => (
  <LayoutMainNavbar>
    {(sticked: boolean) => {
      return (
        <Fragment>
          <Breadcrumbs
            sx={{
              backgroundColor: sticked ? "transparent" : undefined,
              transition: "background-color 0.15s linear",
            }}
          >
            {breadcrumbsItems}
          </Breadcrumbs>
          <Account
            sx={{
              backgroundColor: sticked ? "transparent" : undefined,
              transition: "background-color 0.15s linear",
            }}
          >
            root
          </Account>
        </Fragment>
      );
    }}
  </LayoutMainNavbar>
);

const footer = (
  <LayoutMainFooter>
    <Anchor href="https://deltasolutions.ru" variant="pure">
      DELTA Solutions
    </Anchor>
    <Anchor variant="pure">© 2022</Anchor>
  </LayoutMainFooter>
);

export default function Home() {
  const [t] = useTranslation("common");
  return (
    <ChestsContext.Provider aboba value={createChests(100)}>
      <SystemContainer>
        <Head>
          <style>
            {`
            html, body {
              padding: 0;
              margin: 0;
            }
          `}
          </style>
        </Head>
        <Layout>
          {sidebar}
          <LayoutMain>
            {navbar([
              <BreadcrumbsHome key="1" />,
              <BreadcrumbsItem key="2">Datacenters</BreadcrumbsItem>,
              <BreadcrumbsItem key="3">Datacenter 1</BreadcrumbsItem>,
            ])}
            <LayoutMainHeader>
              <Heading level={1}>{t("count", { count: 100 })}</Heading>
              <CountHeading />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button zoomable color="secondary" variant="outlined">
                  Edit
                </Button>
                <Button zoomable color="error" variant="outlined">
                  Delete
                </Button>
              </Box>
            </LayoutMainHeader>
            <LayoutMainBody variant="tabs">
              <TabGroup activeId="3">
                <TabOption id="1" variant="bookmark">
                  Overview
                </TabOption>
                <TabOption id="2" variant="bookmark">
                  Rooms
                </TabOption>
                <TabOption id="3" variant="bookmark">
                  Devices
                </TabOption>
              </TabGroup>
            </LayoutMainBody>
            <LayoutMainBody
              size="medium"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Counter start={0} />
            </LayoutMainBody>
            {footer}
          </LayoutMain>
        </Layout>
      </SystemContainer>
    </ChestsContext.Provider>
  );
}
