import { Table, Tag, Button, Flex, Space } from 'antd'
import React, { useState, useEffect } from 'react'
import eventBus from '~/eventBus'
import crxCache from '~/utils/cache'
import { deWeightThree } from '~/utils/array'
import xlsxLoader from '~/tabs/excel/loader'
function App() {
  const [dataSource, setDataSource] = useState([])
  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  })
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left'
    },
    {
      title: '类型',
      dataIndex: 'modelTypeName',
      key: 'modelTypeName'
    },
    {
      title: '标签',
      key: 'tagsV2',
      render: (_: any) => {
        return <>
          {_.tagsV2.modelContent.map((i:any, index:number) => (
            <Tag key={index}>{i.tagLabel}</Tag>
          ))}
        </>
      }
    },
    {
      title: '操作',
      width: 80,
      key: 'action',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a onClick={() => handleView(record)}>查看</a>
        </Space>
      )
    }
  ]
  const handleView = async(record:any) => {
    // await eventBus.emitContentScript('handleView', record)
    window.open(`https://www.liblib.art/modelinfo/${record.uuid}?from=feed`)
  }
  const loadData = async() => {
    setLoading(true)
    const params = {
      page: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize
    }
    const url = `https://liblib-api.vibrou.com/api/www/model/feed/stream`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    const rs = await response.json()
    if (rs.code === 0) {
      setDataSource(rs.data.data)
      tableParams.pagination.total = rs.data.total
    } else {
      setDataSource([])
      setTableParams({
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      })
    }
    setLoading(false)
  }

  const handleTableChange = async(
    pagination: any
  ) => {
    tableParams.pagination = pagination
    await loadData()
  }

  const fetchCache = async() => {
    try {
      return await crxCache.getItem('liblib_cache')
    } catch (error) {
      console.error('Error fetching cache:', error)
    }
  }
  const handleExport = async() => {
    await xlsxLoader()
    const sheetName = 'xxx'
    const fileName = 'xxx.xlsx'
    // eslint-disable-next-line no-undef
    const jsonWorkSheet = XLSX.utils.json_to_sheet(dataSource)
    const workBook = {
      SheetNames: [sheetName],
      Sheets: {
        [sheetName]: jsonWorkSheet
      }
    }
    // eslint-disable-next-line no-undef
    return XLSX.writeFile(workBook, fileName)
  }

  const handleRemoveCache = async() => {
    await crxCache.remove('liblib_cache')
    await handleStreamData()
  }
  const handleStreamData = async() => {
    const data = await fetchCache()
    console.log(data, '~~~~~')
    setDataSource(deWeightThree(data || [], 'uuid'))
  }
  useEffect(() => {
    (async() => {
      await loadData()
      // await handleStreamData()
    })()
    // eventBus.on('liblib_cache', handleStreamData)
  }, [])
  return (
    <div className='p-4'>
      <Flex gap='small' wrap className='mb-2'>
        <Button onClick={() => handleExport()}>导出</Button>
        {/* <Button onClick={() => handleRemoveCache()}>清除缓存</Button> */}
      </Flex>

      <Table
        className='h-full'
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ x: 500 }}
        dataSource={dataSource}
        columns={columns}
        rowKey={'id'}
        loading={loading}
      />
    </div>

  )
}
export default App
