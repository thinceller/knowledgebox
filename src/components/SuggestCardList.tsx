import React from 'react'

import { CardList } from './CardList'
import { Card } from './Card'
import { Container } from '@material-ui/core'
import { Title } from 'src/models/Page'
import { prefetchPage } from 'src/hooks/usePage'

type SuggestCardListProps = {
  links: string[]
  titles: Title[]
  ownTitle: string
}

export const SuggestCardList: React.FC<SuggestCardListProps> = ({
  links,
  titles,
  ownTitle,
}) => {
  // ownPageのもつリンクのうち、titlesに存在しているもの
  const linkList = React.useMemo(() => {
    const existLinkList = links?.length
      ? links.filter(link => {
          return titles.map(title => title.title).includes(link)
        })
      : []

    const linkedList = titles?.length
      ? titles
          .filter(title => {
            if (!title.links) {
              return false
            }
            return title.links.includes(ownTitle)
          })
          .map(title => title.title)
      : []

    return [...existLinkList, ...linkedList]
  }, [links, titles, ownTitle])

  const notExistLinkList = React.useMemo(() => {
    if (!links?.length) {
      return []
    }

    return links.filter(link => {
      return !titles.map(title => title.title).includes(link)
    })
  }, [links, titles])

  // titlesに存在するページのうち、ownPageがもつリンクへのリンクをもっているもの
  const otherLinks = React.useMemo(() => {
    if (!links?.length || !titles?.length) {
      return []
    }

    return links
      .map(link => {
        const otherLinkTitles = titles.filter(
          title => title.title !== ownTitle && title.links?.includes(link),
        )
        if (!otherLinkTitles.length) {
          return
        }

        return { link: link, list: otherLinkTitles.map(title => title.title) }
      })
      .filter(d => d)
  }, [links, titles, ownTitle])

  const handleMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      prefetchPage(e.currentTarget.getAttribute('href').replace('/', ''))
    },
    [],
  )

  return (
    <Container>
      {!!linkList.length && (
        <>
          <span>link</span>
          <CardList>
            {linkList.map(link => (
              <Card
                key={link}
                title={link}
                handleMouseEnter={handleMouseEnter}
              />
            ))}
          </CardList>
        </>
      )}
      {!!otherLinks.length &&
        otherLinks.map(data => (
          <React.Fragment key={`otherLink${data.link}`}>
            <span>{data.link}</span>
            <CardList>
              {data.list.map(link => (
                <Card
                  key={link}
                  title={link}
                  handleMouseEnter={handleMouseEnter}
                />
              ))}
            </CardList>
          </React.Fragment>
        ))}
      {!!notExistLinkList.length && (
        <>
          <span>New link</span>
          <CardList>
            {notExistLinkList.map(link => (
              <Card
                key={link}
                title={link}
                handleMouseEnter={handleMouseEnter}
              />
            ))}
          </CardList>
        </>
      )}
    </Container>
  )
}
