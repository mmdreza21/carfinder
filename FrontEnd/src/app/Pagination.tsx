"use client";

import { Button, Flex, Text } from "@radix-ui/themes";

interface Props {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Flex align="center" justify="between" gap="3">
      <Button
        variant="soft"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <Text size="2" color="gray">
        Page {page} of {totalPages}
      </Text>

      <Button
        variant="soft"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </Flex>
  );
}
