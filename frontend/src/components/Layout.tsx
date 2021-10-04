import { Box } from "@chakra-ui/layout";
import { Drawer, DrawerContent, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { MobileNav } from "./MobileNav";
import { SidebarContent } from "./Sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({children}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
  // return (
  //   <>
  //     <Header />

  //     <main>
  //       {children}
  //     </main>

  //     <Footer />
  //   </>
  // )
}
