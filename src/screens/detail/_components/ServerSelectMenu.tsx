import React from 'react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import { Text } from '@/components/text';
import { Episode } from '@/types/models/movie';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { Box } from '@/components/box';
import Monicon from '@monicon/native';

interface Props {
  activeIndex: number;
  servers: Episode[];
  onServerSelect: (index: number) => void;
}

const ServerSelectMenu = ({ activeIndex, servers, onServerSelect }: Props) => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Box
          row
          gap={3}
          py={8}
          px={10}
          bg={'#1c1c20'}
          wFit
          alignSelf="flex-start"
          alignItems="center"
          rounded={6}
        >
          <Text color="#1f6efc" fontFamily={Text.fonts.inter.medium}>
            {servers[activeIndex].server_name}
          </Text>
          <Monicon name="ri:arrow-down-s-line" color="#1f6efc" />
        </Box>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        <DropdownMenu.Label>Chọn nguồn Server</DropdownMenu.Label>
        {servers.map((server, index) => (
          <DropdownMenuItem
            key={`${index}`}
            onSelect={() => onServerSelect(index)}
          >
            <DropdownMenuItemTitle>{server.server_name}</DropdownMenuItemTitle>
            <DropdownMenu.Arrow />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};

export default ServerSelectMenu;
